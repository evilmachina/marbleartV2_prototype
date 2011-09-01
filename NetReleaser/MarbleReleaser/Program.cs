using System;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using Microsoft.SPOT;
using Microsoft.SPOT.Hardware;
using SecretLabs.NETMF.Hardware;

namespace MarbleReleaser
{
    public class Program
    {
        public static void Main()
        {
            var mr =new MarbleRunner();
            mr.Start();
        }

    }
}
