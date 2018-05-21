using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI3.Model
{
    public class ApplicationException : Exception
    {
        public ResponseDTO ApplicationExceptionu(string msg)
        {
            return new ResponseDTO(false, msg, null);
        }
    }
}
