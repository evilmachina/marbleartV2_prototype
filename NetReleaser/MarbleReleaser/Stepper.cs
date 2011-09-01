using System;
using Microsoft.SPOT.Hardware;
using System.Threading;

namespace MarbleReleaser
{
    class Stepper
    {
        private OutputPort stepperPort;
        private OutputPort enablePort;

        public Stepper(Microsoft.SPOT.Hardware.Cpu.Pin stepperPin, Microsoft.SPOT.Hardware.Cpu.Pin enablePin)
        {
            stepperPort = new OutputPort(stepperPin, false);
            enablePort = new OutputPort(enablePin, true);
        }

        internal void Step(int p)
        {
            enablePort.Write(false);
            for (int i = 0; i < p; i++)
            {
                stepperPort.Write(true);
                stepperPort.Write(false);
                Thread.Sleep(20);
            }
           // enablePort.Write(true);
        }

        public void StepOneStep()
        {
            Step(1);
        }
    }
}
