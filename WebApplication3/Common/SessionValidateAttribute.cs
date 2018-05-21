using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Principal;
using System.Threading;
using System.Web.Http.Controllers;
using WebAPI3.Model;
using WebAPI3.Service;

namespace WebAPI3.Common
{
    public class SessionValidateAttribute : System.Web.Http.Filters.ActionFilterAttribute
    {
        public const string SessionKeyName = "SessionKey";
        public const string LogonUserName = "LogonUser";

        public override void OnActionExecuting(HttpActionContext filterContext)
        {
            var qs = HttpUtility.ParseQueryString(filterContext.Request.RequestUri.Query);
            IEnumerable<string> se=null;
            var qs2 = filterContext.Request.Headers.TryGetValues("SessionKey",out se );
            string sessionKey = qs[SessionKeyName];

            if (string.IsNullOrEmpty(sessionKey))
            {
                throw new ApiException("无效 Session.","invalid session");
            }

            //IAuthenticationService authenticationService = new AuthenticationService();//IocManager.Intance.Reslove<IAuthenticationService>();
            UserInfoService us = new UserInfoService();

            //验证用户session
            var userSession = us.GetUserBySessionKey(sessionKey);

            if (userSession == null)
            {
                throw new ApiException("无此 sessionKey", "RequireParameter_sessionKey");
            }
            else
            {
                //todo: 加Session是否过期的判断
                //if (userSession.ExpiredTime < DateTime.UtcNow)
                //    throw new ApiException("session已过期", "SessionTimeOut");
                ////var logonUser =authenticationService.GetUser(userSession.UserId);
                //var logonUser = us.GetUserInfo(userSession.Id);//**通过session的ID重新查询user
                //if (logonUser != null)
                //{
                //    filterContext.ControllerContext.RouteData.Values[LogonUserName] = logonUser;//***控制器上下文里给用户赋值
                //    SetPrincipal(new UserPrincipal<int>(logonUser));//**??更新数据库
                //}
                //userSession.ActiveTime = DateTime.UtcNow;
               // userSession.ExpiredTime = DateTime.UtcNow.AddMinutes(60);
                //authenticationService.UpdateUserDevice(userSession);
            }
        }

        public static void SetPrincipal(IPrincipal principal)
        {
            Thread.CurrentPrincipal = principal;
            if (HttpContext.Current != null)
            {
                HttpContext.Current.User = principal;
            }
        }
    }
}