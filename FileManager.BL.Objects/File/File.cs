using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileManager.BL.Objects.File
{
    public class MyFile
    {
        public Guid? ID { get; set; }
        public DateTime Date { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
    }
}
