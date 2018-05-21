using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Filters;
using WebAPI3.Model;
using Newtonsoft.Json;

namespace WebAPI3.App_Start
{
    public class WExceptionFilterAttribute : ExceptionFilterAttribute  
    {  
        public override void OnException(HttpActionExecutedContext context)  
        {  
            //可以记录一些日志  
            string fLog = context.Exception.ToString();
            string ex = context.Exception.Message;

            //篡改Response  
            context.Response = new HttpResponseMessage(HttpStatusCode.OK);  
            
            context.Response.Content = new StringContent(JsonConvert.SerializeObject(new ResponseDTO(false, ex,null)));  
        }  
    }  
}  
