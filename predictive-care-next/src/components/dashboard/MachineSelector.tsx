'use client';

import { ChevronDown } from 'lucide-react';

interface MachineSelectorProps {
  selectedMachine: string;
  onMachineChange: (machine: string) => void;
}

const machines = [
  { id: 'Machine-H1', name: 'Machine H1', status: 'active' },
  { id: 'Machine-H2', name: 'Machine H2', status: 'active' },
  { id: 'Machine-M1', name: 'Machine M1', status: 'warning' },
  { id: 'Machine-L1', name: 'Machine L1', status: 'active' },
];

export default function MachineSelector({ selectedMachine, onMachineChange }: MachineSelectorProps) {
  return (
    <div className="relative">
      <select
        value={selectedMachine}
        onChange={(e) => onMachineChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 cursor-pointer hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
      >
        {machines.map((machine) => (
          <option key={machine.id} value={machine.id}>
            {machine.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
