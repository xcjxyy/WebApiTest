using IBatisNet.Common.Utilities;
using IBatisNet.DataMapper;
using IBatisNet.DataMapper.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI3.Dao
{
    public class SqlAdapter
    {
        public  object ExecuteInsert(string statementName, object parameterObject)
        {
            ISqlMapper sqlMap = Mapper.GetMaper;
            //DateTime dt_begin = DateTime.Now;
            try
            {
                object o = sqlMap.Insert(statementName, parameterObject);
                //logsql(dt_begin, statementName, parameterObject, 0, "INSERT", "");
                return o;
            }
            catch (Exception exception)
            {
                //logsql(dt_begin, statementName, parameterObject, 1, "INSERT", exception);
                throw exception;
            }
        }

        public  int ExecuteUpdate(string statementName, object parameterObject)
        {
            ISqlMapper sqlMap = Mapper.GetMaper;
            try
            {
                int o = sqlMap.Update(statementName, parameterObject);
                return o;
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

        public  int ExecuteDel(string statementName, object parameterObject)
        {
            ISqlMapper sqlMap = Mapper.GetMaper;
            try
            {
                int o = sqlMap.Delete(statementName, parameterObject);
                return o;
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

        public  void ExecuteBatch(IEnumerable<iBatisStatement> batchStatements)
        {
            //DateTime dt_begin = DateTime.Now;
            ISqlMapper sqlMap = Mapper.GetMaper;
            int i = 0;
            int ok = 1;
            try
            {
                sqlMap.BeginTransaction();
            }
            catch
            {
                ok = 0;
            }

            try
            {
                foreach (iBatisStatement statement in batchStatements)
                {
                    if (statement.Type == SqlExecuteType.INSERT)
                    {
                        sqlMap.Insert(statement.StatementName, statement.ParameterObject);
                    }
                    else if (statement.Type == SqlExecuteType.UPDATE)
                    {
                        sqlMap.Update(statement.StatementName, statement.ParameterObject);
                    }
                    else
                    {
                        sqlMap.Delete(statement.StatementName, statement.ParameterObject);
                        
                    }
                    i++;
                }

                if (ok == 1)
                {
                    sqlMap.CommitTransaction();
                }
            }
            catch (Exception ex)
            {
                sqlMap.RollBackTransaction();
                throw ex;
            }
        }

        public void ExecuteBatch(IEnumerable<string> sqlStatements)
        {
            List<iBatisStatement> theIBatisNetBatchStatements = new List<iBatisStatement>();

            foreach (string sqlStatement in sqlStatements)
            {
                string tempsql = sqlStatement.ToUpper().Trim();
                SqlExecuteType type = default(SqlExecuteType);
                if (tempsql.StartsWith(SqlExecuteType.INSERT.ToString()))
                {
                    type = SqlExecuteType.INSERT;
                }
                else if (tempsql.StartsWith(SqlExecuteType.UPDATE.ToString()))
                {
                    type = SqlExecuteType.UPDATE;
                }
                else if (tempsql.StartsWith(SqlExecuteType.DELETE.ToString()))
                {
                    type = SqlExecuteType.DELETE;
                }

                theIBatisNetBatchStatements.Add(new iBatisStatement() { StatementName = "ExecuteSqlNoneQuery", ParameterObject = sqlStatement, Type = type });
            }

            ExecuteBatch(theIBatisNetBatchStatements);
        }

        public  IList<T> ExecuteQueryForList<T>(string statementName, object parameterObject) 
        {

            ISqlMapper sqlMap = Mapper.GetMaper;  
            //DateTime dt_begin = DateTime.Now;
            try
            {

                IList<T> record = sqlMap.QueryForList<T>(statementName, parameterObject);//**** 调用ISqlMapper.QueryForList
                //logsql(dt_begin, statementName, parameterObject, 0, "SELECT", "");
                return record;
            }
            catch (Exception exception)
            {
                /// logsql(dt_begin, statementName, parameterObject, 1, "SELECT", exception);
                throw;
            }
        }

    }
}
    