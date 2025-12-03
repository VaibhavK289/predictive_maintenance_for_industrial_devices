# Takes input frmo the csv file which was fetched frmo the arduino

import random
import time
import queue
import threading
import csv
import pandas as pd
from pycaret.classification import load_model, predict_model

try:
    model = load_model('predictive_maintenance')
    print("Model loaded successfully from predictive_maintenance")
except FileNotFoundError:
    print("Error: predictive_maintenance not found.  Make sure the file is in the correct directory.")
    exit()
except Exception as e:
    print(f"Error loading the model: {e}")
    exit()


def generate_sensor_data(data_queue):
    try:
        with open('sensor_input.csv', 'r', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            if 'air_temp' not in (field.lower() for field in reader.fieldnames) or \
               'process_temp' not in (field.lower() for field in reader.fieldnames):
                raise ValueError("CSV file must contain columns 'air_temp' and 'process_temp'.")

            temperature_data = list(reader)  # Read all temperature data into a list

            while True:
                if not temperature_data:
                    print("End of CSV file reached. Looping from the beginning.")
                    csvfile.seek(0)  # Go back to the beginning of the file
                    next(reader)     # Skip the header row
                    temperature_data = list(reader)

                temp_reading = random.choice(temperature_data) # Randomly select a row of temperature data

                try:
                    air_temp = float(temp_reading['air_temp'])
                    process_temp = float(temp_reading['process_temp'])
                except ValueError:
                    print(f"Skipping invalid temperature data: {temp_reading}")
                    continue

                tool_wear = random.randint(0, 300)
                rotation_speed = random.randint(1000, 3000)
                torque = random.randint(5, 75)

                temp_diff = process_temp - air_temp
                power = 2 * 3.14159 * rotation_speed * torque / 60

                data = {
                    "tool_wear": tool_wear,
                    "air_temp": air_temp,
                    "process_temp": process_temp,
                    "rotation_speed": rotation_speed,
                    "torque": torque,
                    "temp_diff": temp_diff,
                    "power": power,
                    "timestamp": time.time()
                }
                data_queue.put(data)
                time.sleep(2)

    except FileNotFoundError:
        print(f"Error: CSV file not found at {'sensor_input.csv'}")
    except ValueError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")



def process_sensor_data(data, model):
    input_data = pd.DataFrame({
        'Type_H': [0],
        'Type_L': [1],
        'Type_M': [0],
        'Tool wear': [data["tool_wear"]],
        'Power': [data["power"]], #  USING POWER HERE because your model expects 'Power'
        'temp_diff': [data["temp_diff"]]
    })

    try:
        predictions = predict_model(model, data=input_data, raw_score=True)
        # print(predictions)
        prediction_label = predictions['prediction_label'][0]
        prediction_score = predictions['prediction_score_1'][0]

    except Exception as e:
        print(f"Prediction error: {e}")
        prediction_label = None
        prediction_score = None


    processed_data = {
        "Type_H": 0,  # Constant values
        "Type_L": 1,
        "Type_M": 0,
        "Tool wear": data["tool_wear"],
        "rotation_speed": data["rotation_speed"], # Storing rotation speed
        "torque": data["torque"], # Storing torque
        "air_temp": data["air_temp"], # Storing air_temp
        "process_temp": data["process_temp"], # Storing process_temp
        "temp_diff": data["temp_diff"], # Storing temp_diff
        "power": data["power"], # Storing power as well
        "prediction_label": prediction_label,
        "prediction_score": prediction_score,
        "timestamp": data["timestamp"]
    }
    return processed_data

def store_data(processed_data, csv_file):
    writer = csv.writer(csv_file)
    # writer.writerow([processed_data["Type_H"], processed_data["Type_L"], processed_data["Type_M"],
    #                  processed_data["Tool wear"], processed_data["power"], processed_data["temp_diff"], # Power is written to CSV
    #                  processed_data["prediction_label"], processed_data["prediction_score"],
    #                  processed_data["rotation_speed"], processed_data["torque"],
    #                  processed_data["air_temp"], processed_data["process_temp"]
    #                  ])
    writer.writerow([
        processed_data["Type_H"],
        processed_data["Type_L"],
        processed_data["Type_M"],
        processed_data["Tool wear"],
        processed_data["rotation_speed"],
        processed_data["torque"],
        processed_data["air_temp"],
        processed_data["process_temp"],
        processed_data["temp_diff"],
        processed_data["power"],  # Power is written to CSV
        processed_data["prediction_label"],
        processed_data["prediction_score"]
    ])

def data_processing_thread(data_queue, csv_file, model):
    while True:
        data = data_queue.get()  # Blocking call, waits for data
        processed_data = process_sensor_data(data, model)  # Pass the model here
        store_data(processed_data, csv_file)
        data_queue.task_done()


if __name__ == "__main__":
    data_queue = queue.Queue()

    csv_file = open("sensor_data.csv", "w", newline='')
    writer = csv.writer(csv_file)
    writer.writerow(["Type_H", "Type_L", "Type_M", "Tool wear", "rotation_speed", "torque", "air_temp", "process_temp", "temp_diff", "Power", "prediction_label", "prediction_score"])  # Write header, more intuitive order
    # writer.writerow(["Type_H", "Type_L", "Type_M", "Tool wear", "Power", "temp_diff", "prediction_label", "prediction_score", "rotation_speed", "torque", "air_temp", "process_temp"])

    sensor_thread = threading.Thread(target=generate_sensor_data, args=(data_queue,))
    processing_thread = threading.Thread(target=data_processing_thread, args=(data_queue, csv_file, model))  # Pass the model here

    sensor_thread.daemon = True
    processing_thread.daemon = True

    sensor_thread.start()
    processing_thread.start()

    time.sleep(10)

    csv_file.close()
    print("Data generation and processing complete.")
