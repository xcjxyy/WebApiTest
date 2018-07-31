using System.Web.Http;
using WebActivatorEx;
using WebAPI3;
using Swashbuckle.Application;

[assembly: PreApplicationStartMethod(typeof(SwaggerConfig), "Register")]

namespace WebAPI3
{
        public class SwaggerConfig
        {
            public static void Register()
            {
                var thisAssembly = typeof(SwaggerConfig).Assembly;

                GlobalConfiguration.Configuration
                    .EnableSwagger(c =>
                    {

                        c.SingleApiVersion("v1", "WebAPI3");
                        //添加XML解析
                        c.IncludeXmlComments(GetXmlCommentsPath());

                    })
                    .EnableSwaggerUi(c =>
                    {

                    });
            }
            //添加XML解析
            private static string GetXmlCommentsPath()
            {
                return string.Format("{0}/bin/WebAPI3.XML", System.AppDomain.CurrentDomain.BaseDirectory);
            }

    }
}
