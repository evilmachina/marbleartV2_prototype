using System;
using System.Net.Sockets;
using System.Net;
using System.Threading;
using Microsoft.SPOT;
using Microsoft.SPOT.Hardware;
using SecretLabs.NETMF.Hardware.NetduinoPlus;

namespace MarbleReleaser
{
    internal class TcpLisserner
    {
        public delegate void call();

        private OutputPort led;
        public TcpLisserner()
        {
            led = new OutputPort(Pins.ONBOARD_LED, false);

            
        }


        public void Start(call step)
        {
            try
            {
                var s = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
                var ip = IPAddress.Parse("178.79.188.184");
                var endPoint = new IPEndPoint(ip, 51337);
                s.Connect(endPoint);
                led.Write(true);
                var data = new byte[1];
                while (true)
                {

                    if (s.Available > 0)
                    {
                        
                        s.Receive(data);
                       if(data[0] == 10)
                        step.Invoke();
                    }
                    else
                    {
                        Thread.Sleep(100);
                    }
                }
                s.Close();
            }
            catch (Exception ex)
            {
                led.Write(false);
                Debug.Print(ex.Message);

            }
        }
    }
}