using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebAPI3.Model;
using WebAPI3.Dao;
using WebAPI3.Service;
using WebAPI3;
using WebAPI3.App_Start;
using System.Web;
using WebAPI3.Common;

namespace WebAPI3.Controllers
{
    [WExceptionFilter]
    public class UserInfoController : ApiController
    {
        UserInfoService uss = new UserInfoService();
        [SessionValidate]
        [HttpPost, Route("api/userinfo/GetUsers")]
        public IList<Hashtable> GetUsers([FromBody]PageCriteria pc)
        {
            PageCriteria con = new PageCriteria ();
            //int Id = 43;
            con.userid =pc.userid;
            IList<Hashtable> users = uss.GetUserInfoListHashBySP(con);
            object a = new { UserName = "x", sex = "1", Age = 12 };
            object b = new { UserName = "y", sex = "0", Age = 22 };
            IList<object> uo = new List<object>();
            uo.Add(a);
            uo.Add(b);

            return users;
        }

        [HttpGet, Route("api/userinfo/GetUsers0")]
        public IList<Hashtable> GetUsers0()
        {
          
            IList<Hashtable> users = uss.GetUserInfoListHash();
            return users;
        }

        //public IDictionary<string, IList<UserInfo>> GetUsersDic()
        //{
        //    IDictionary<string, IList<UserInfo>> Di = new Dictionary<string, IList<UserInfo>>();
        //    string k = "KEY";
        //    IList<UserInfo> users = GetUsers0();
        //    Di.Add(k, users);
        //    return Di;
        //}

        public int PostUser(UserInfo user)
        {

            int a = uss.UserInfoInsertOne(user);
            return a;


        }

        // [Route("api/{controller}/name={name}")]
        //public int PostUser1(UserInfo user)
        //{
        //    IList<UserInfoItem> li = new List<UserInfoItem>();
        //    li = user.Items;
        //    int id = uss.UserInfoInsertOne(user);
        //    foreach(UserInfoItem a1 in li)
        //    {
        //        //System.Console.Write(a1.Address + " " + a1.Id.ToString());
        //        a1.Id = id;
        //        uss.UserInfoItemInsertOne(a1);
        //    }
        //    return id;
        //}

        [HttpGet]
        public ResponseDTO Login(int username, string password)//post  需要用对象表述？？
        {
            string md5pwd;
            if (password == null)
            {
                md5pwd = "";
            }
            else
            {
                md5pwd = MD5CryptoProvider.GetMD5Hash(password);
            };
            UserInfo logUser = uss.GetUserInfo(username,md5pwd);
           
            string passkey = MD5CryptoProvider.GetMD5Hash(logUser.Id + logUser.Password + DateTime.UtcNow + Guid.NewGuid());
            logUser.SessionKey = passkey;
            uss.UpdateUserInfo(logUser);

            HttpContext.Current.Session["USERNAME"] = logUser.Password;
            string x = HttpContext.Current.Session["USERNAME"].ToString();
            IDictionary<string, object> _id = new Dictionary<string, object>();
            _id["logUser"] = logUser;
            _id["SessionKey"] = passkey;

           return new ResponseDTO(true,"OK",logUser);
         
        }

        public void UserInsert(UserInfo userInfo)
        {
            Card card1 = new Card();
            card1.CardName = "card1";
            Card card2 = new Card();
            card2.CardName = "card2";
            List<Card> cards = new List<Card>() { card1, card2 };
            Hashtable ht = new Hashtable();
            ht["DjName"] = "userinfo";
            ht["DjLsh"] = 0;
            uss.GetDjlsh(ht);//调用sp产生 djlsh
            IList<iBatisStatement> ibs = new List<iBatisStatement>();
            ibs.Add(new iBatisStatement()
            {
                StatementName = "UserInfo.insert_UserInfoOne",
                ParameterObject = userInfo,
                Type = SqlExecuteType.INSERT
            });
            ibs.Add(new iBatisStatement
            {
                StatementName = "Card.insert_CardOne",
                ParameterObject = card1,
                Type = SqlExecuteType.INSERT
            });
            ibs.Add(new iBatisStatement
            {
                StatementName = "Card.insert_CardOne",
                ParameterObject = card2,
                Type = SqlExecuteType.INSERT
            });

            SqlAdapter.ExecuteBatch(ibs);//事务批处理sql语句

        }
    }
}
