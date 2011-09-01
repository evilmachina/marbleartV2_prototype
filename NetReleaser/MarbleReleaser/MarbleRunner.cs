using Microsoft.SPOT;
using SecretLabs.NETMF.Hardware.NetduinoPlus;

namespace MarbleReleaser
{
    public class MarbleRunner
    {
       
        
        internal void Start()
        {
            StartUpDebugLoger();


            Stepper stepper = new Stepper(Pins.GPIO_PIN_D2, Pins.GPIO_PIN_D3);
           
            TcpLisserner tcpLisserner = new TcpLisserner();
            tcpLisserner.Start(stepper.StepOneStep);
          
        }

        private static void StartUpDebugLoger()
        {
            Debug.Print("Start");
            Debug.Print(Microsoft.SPOT.Net.NetworkInformation.NetworkInterface.GetAllNetworkInterfaces()[0].IPAddress);
        }


    }
}