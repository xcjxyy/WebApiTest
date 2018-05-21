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
        public int UserInfoInsertOne(UserInfo userInfo)
        {
            //Object obj = Mapper.GetMaper.Insert("UserInfo.insert_UserInfoOne", userInfo);
            Object obj = SqlAdapter.ExecuteInsert("UserInfo.insert_UserInfoOne", userInfo);
            IList<iBatisStatement> il=new List<iBatisStatement>();
            //il.Add(new IBatisNetBatchStatement { StatementName = "UserInfo.insert_UserInfoOne", ParameterObject = userInfo, Type = SqlExecuteType.INSERT });
            //SqlAdapter.ExecuteBatch(il);
            //return 1;
            return (int)obj;
        }
        public void UserInfoItemInsertOne(UserInfoItem userInfoItem)
        {
            IList<iBatisStatement> il = new List<iBatisStatement>();
            il.Add(new iBatisStatement { StatementName = "UserInfoItem.insert_UserInfoItem", ParameterObject = userInfoItem, Type = SqlExecuteType.INSERT });
            SqlAdapter.ExecuteBatch(il);
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

            return Mapper.GetMaper.QueryForList<Hashtable>("UserInfo.select_UserInfoAll_Hash", null);
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

    //    public int ExecuteBatch(IEnumerable<iBatisStatement> batchStatements)
    //    {
    //        //ISqlMapper sqlMap = Mapper.GetMaper;
    //        int i = 0;
    //        int ok = 1;
    //        try
    //        {
    //            Mapper.GetMaper.BeginTransaction();
    //        }
    //        catch
    //        {
    //            ok = 0;
    //        }

    //        try
    //        {
    //            foreach (iBatisStatement statement in batchStatements)
    //            {
    //                if (statement.Type == SqlExecuteType.INSERT)
    //                {
    //                    Mapper.GetMaper.Insert(statement.StatementName, statement.ParameterObject);
    //                }
    //                else if (statement.Type == SqlExecuteType.UPDATE)
    //                {
    //                    Mapper.GetMaper.Update(statement.StatementName, statement.ParameterObject);
    //                }
    //                else
    //                {
    //                    Mapper.GetMaper.Delete(statement.StatementName, statement.ParameterObject);

    //                }
    //                i++;
    //            }

    //            if (ok == 1)
    //            {
    //                Mapper.GetMaper.CommitTransaction();
    //            }
    //        }
    //        catch (Exception ex)
    //        {
    //            Mapper.GetMaper.RollBackTransaction();
    //            throw ex;
    //        }
    //        return ok;
    //    }
    }

}
