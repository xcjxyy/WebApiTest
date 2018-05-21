using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI3.Common
{
    public class ApiException : Exception
    {
        public string ErrorCode { get; set; }
        public ApiException(string message, string errorCode)
            : base(message)
        {
            ErrorCode = errorCode;
        }
    }
}