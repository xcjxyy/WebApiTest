using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI3.Model
{
    
    public class ResponseDTO
    {
        public bool success{set;get;}
        public string message { set; get; }
        public Object data { set; get; }
        
        
        //private bool _success;
        //private string _message;
        //private Object _data;

        public ResponseDTO()
        {

        }

        public ResponseDTO(bool success, string message, Object data)
        {
            this.success = success;
            this.message = message;
            this.data = data;
        }

        //public bool isSuccess()
        //{
        //    return _success;
        //}

        //public void setSuccess(bool success)
        //{
        //    _success = success;
        //}

        //public String getMessage()
        //{
        //    return _message;
        //}
        //public void setMessage(String message)
        //{
        //    _message = message;
        //}
        //public Object getData()
        //{
        //    return _data;
        //}

        //public void setData(Object data)
        //{
        //    _data = data;
        //}
	
    }
}
