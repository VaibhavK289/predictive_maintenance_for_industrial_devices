> Simple explanation of how the migration of local to AWS will work

sabse pehle to hardcoded ports mat rakho
ports jab likhte hai, aise likho
`cosnt PORT = process.env.PORT || 5432`
and humare .env file me hum `PORT=${env.DB_HOST}` likh denge
isse wo ports wali issue nahi aayegi, kyuki wo dynamically jis bhi database ko use karega uska port use kar lega

ab database ko hum rds me upload karenge

database ho gaya, ab baaki ke jo backend ke files hai, unko zip karke aws lambda me daalenge
fir lambda ko hum permissions de dete hai (aws treats lambda as a user doing tasks) necessary wale (necessary=saare in our case kyuki jhamela nahi chaihye permission errors ka)

ye sab karke lambda function jab save ho gaya to uska ek link hota hai (api link bolte usko)
is link ko hum apne react app pe hum is url ko publically exported rakhenge (`export const API_URL="http...."`)

then aws amplify me iska github repo daalenge and deploy kar denge

## Tools/Services
- AWS Lambda - Backend
- AWS Amplify - React
- AWS RDS - SQL Database
- AWS Sagemaker - ML Model Deployment
