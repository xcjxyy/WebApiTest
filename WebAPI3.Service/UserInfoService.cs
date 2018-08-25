using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAPI3.Model;
using WebAPI3.Dao;
using System.Collections;
using WebAPI3.Core;

namespace WebAPI3.Service
{
    public class UserInfoService
    {
        public UserInfo UserInfoEdit(UserInfo userInfo)
        {
            //Object obj = Mapper.GetMaper.Insert("UserInfo.insert_UserInfoOne", userInfo); //****转SqlAdapter调用，不直接调用Mapper
            IList<iBatisStatement> il = new List<iBatisStatement>();
            Hashtable ht = new Hashtable();
            ht["DjName"] = "userinfo";
            ht["DjLsh"] = 0;
            if (userInfo.Id == 0)
            {
                this.GetDjlsh(ht);
                userInfo.Id = (int)ht["DjLsh"];
                il.Add(new iBatisStatement { StatementName = "UserInfo.insert_UserInfoOne", ParameterObject = userInfo, Type = SqlExecuteType.INSERT });
            }
            else
            {
                ht["DjLsh"] = userInfo.Id;
                il.Add(new iBatisStatement { StatementName = "UserInfo.update_UserInfoOne", ParameterObject = userInfo, Type = SqlExecuteType.UPDATE });
                il.Add(new iBatisStatement { StatementName = "Card.deleteCardBysUserid", ParameterObject = userInfo, Type = SqlExecuteType.DELETE });
            }

            for (int i = 0; i < userInfo.Cards.Count; i++)
            {
                il.Add(new iBatisStatement { StatementName = "Card.insert_CardOne", ParameterObject = userInfo.Cards[i], Type = SqlExecuteType.INSERT });
            };

            try
            {
                BuilderFactory.Default().ExecuteBatch(il);
                //SqlAdapter.ExecuteBatch(il);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            //return (int)ht["DjLsh"]
            int id = (int)ht["DjLsh"];
            return this.GetUserInfo2(id);

        }
        public UserInfo userInfoAudit(int Id)
        {
            UserInfo u = GetUserInfo2(Id);
            if (!(u.Status == ""))
            {
                throw new ApiException("已审核，不能再审！", "不能审核！");
            }
            u=userInfoAudit(u);
            //int u2= UpdateUserInfo(u);//返回的int是什么值？执行成功1失败0
            return u;
        }
        private UserInfo userInfoAudit(UserInfo u)
        {
            u.Auidt();
            int id = u.Id;
            Hashtable ht = new Hashtable();
            ht["id"] = u.Id;
            IList<iBatisStatement> il = new List<iBatisStatement>();
            il.Add(new iBatisStatement { StatementName = "UserInfo.update_UserInfoOne", ParameterObject = u, Type = SqlExecuteType.UPDATE });
            il.Add(new iBatisStatement { StatementName = "UserInfo.auditSP", ParameterObject = ht,Type=SqlExecuteType.INSERT });
            try
            {
                BuilderFactory.Default().ExecuteBatch(il);
                //SqlAdapter.ExecuteBatch(il);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return u;
        }
        public int PostUser(UserInfo userInfo)
        {
            Hashtable ht = new Hashtable();
            ht["DjName"] = "userinfo";
            ht["DjLsh"] = 0;
            this.GetDjlsh(ht);
            userInfo.Id = (int)ht["DjLsh"];

            IList<iBatisStatement> il = new List<iBatisStatement>();
            il.Add(new iBatisStatement { StatementName = "UserInfo.insert_UserInfoOne", ParameterObject = userInfo, Type = SqlExecuteType.INSERT });
            for (int i = 0; i < userInfo.Cards.Count; i++)
            {
                il.Add(new iBatisStatement { StatementName = "Card.insert_CardOne", ParameterObject = userInfo.Cards[i], Type = SqlExecuteType.INSERT });
            };

            try
            {
                BuilderFactory.Default().ExecuteBatch(il);
                //SqlAdapter.ExecuteBatch(il);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return 1;
        }
        public void UserInfoItemInsertOne(UserInfoItem userInfoItem)
        {
            IList<iBatisStatement> il = new List<iBatisStatement>();
            il.Add(new iBatisStatement { StatementName = "UserInfoItem.insert_UserInfoItem", ParameterObject = userInfoItem, Type = SqlExecuteType.INSERT });
            BuilderFactory.Default().ExecuteBatch(il);
            //SqlAdapter.ExecuteBatch(il);
        }

        public UserInfo GetUserInfo(int id,string pwd)
        {
            UserInfo log = new UserInfo();
            log=(UserInfo)Mapper.GetMaper.QueryForObject("UserInfo.select_UserInfoOne", id);
            if (log == null) 
            { throw new ApiException("NND","kk"); }
            else if (!log.Password.Equals(pwd)) 
            { throw new ApiException("22", "密码有误"); }

            return log;
        }

        public IList<UserInfo> GetUserInfoList()
        {
            //xml里面配置的格式
            return Mapper.GetMaper.QueryForList<UserInfo>("UserInfo.select_UserInfoAll", null);
        }

        public IList<Hashtable> GetUserInfoListHash()
        {
            //return SqlAdapter.ExecuteQueryForList<Hashtable>("UserInfo.select_UserInfoAll_Hash", null);
            return BuilderFactory.Default().ExecuteQueryForList<Hashtable>("UserInfo.select_UserInfoAll_Hash", null);
            //return Mapper.GetMaper.QueryForList<Hashtable>("UserInfo.select_UserInfoAll_Hash", null);
        }

        public IList<Hashtable> GetUserInfoListHashBySP(PageCriteria con)
        {
            if (con == null) { return Mapper.GetMaper.QueryForList<Hashtable>("UserInfo.sp_select_user0", null);
            }
            else {
                return Mapper.GetMaper.QueryForList<Hashtable>("UserInfo.sp_select_user", con);
            }
            
        }

        public int DelUserInfoOne(int id)
        {
            Object obj = Mapper.GetMaper.Delete("UserInfo.del_UserInfoOne", id);
            return (int)obj;
        }
        public int UpdateUserInfo(UserInfo userInfo)
        {
            Object obj = Mapper.GetMaper.Update("UserInfo.update_UserInfoOne", userInfo);
            return (int)obj;
        }

        public UserInfo GetUserBySessionKey(string sessionkey)
        {
            UserInfo log = new UserInfo();
            log = (UserInfo)Mapper.GetMaper.QueryForObject("UserInfo.select_UserInfoBySessionkey", sessionkey);
            if (log == null) { throw new Exception("NND"); }
            return log;
        }

        public void GetDjlsh(Hashtable ht)   //**调用SP
        {
            Mapper.GetMaper.Insert("UserInfo.SP_getDjlsh", ht);
        }



        public UserInfo GetUserInfo2(int id)
        {
            //throw new NotImplementedException();
            UserInfo user = new UserInfo();
            user = (UserInfo)Mapper.GetMaper.QueryForObject("UserInfo.select_UserInfoOne2", id);
            if (user == null)
            { throw new ApiException("NND", "kk"); }

            return user;

        }
    }

}
