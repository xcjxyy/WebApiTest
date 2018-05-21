using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using System.Web.SessionState;
using WebAPI3.App_Start;

namespace WebAPI3
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            GlobalConfiguration.Configuration.Formatters.XmlFormatter.SupportedMediaTypes.Clear();
            GlobalConfiguration.Configuration.Filters.Add(new WExceptionFilterAttribute());
            //HttpConfiguration fConfig = GlobalConfiguration.Configuration;
            //fConfig.Formatters.Remove(fConfig.Formatters.JsonFormatter);
            //fConfig.Formatters.Remove(fConfig.Formatters.XmlFormatter);
            //fConfig.Formatters.Insert(0, new JilFormatter());  
        }

        public override void Init()
        {
            PostAuthenticateRequest += MvcApplication_PostAuthenticateRequest;
            base.Init();
        }

        void MvcApplication_PostAuthenticateRequest(object sender, EventArgs e)
        {
            HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
        }
    }
}
