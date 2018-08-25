using IBatisNet.Common.Utilities;
using IBatisNet.DataMapper;
using IBatisNet.DataMapper.Configuration;
using IBatisNet.DataMapper.Configuration.Statements;
using IBatisNet.DataMapper.MappedStatements;
using IBatisNet.DataMapper.Scope;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI3.Dao
{

        public class SqlMapperCreater
    {
        protected static ISqlMapper m_sqlMap = null;
        protected static void Configure(object obj)
        {
            m_sqlMap = null;
        }

        public static ISqlMapper SqlMap
        {
            get
            {
                if (m_sqlMap == null)
                {
                    //string fileName = "Config\\sqlMap.config";
                    //DomSqlMapBuilder builder = new DomSqlMapBuilder();
                    //m_sqlMap = builder.Configure(fileName);
                    
                    ConfigureHandler hander = new ConfigureHandler(Configure);
                    DomSqlMapBuilder builder = new DomSqlMapBuilder();
                    m_sqlMap = builder.ConfigureAndWatch("SqlMap.config", hander);

                }
                return m_sqlMap;
            }
        }
    }
        public class DaoBase<T> : MarshalByRefObject where T : EntityBase
        {
            private static ISqlMapper SqlMap;
            /// <summary>
            /// 构造函数
            /// </summary>         
            /// 
            static DaoBase()
            {
                if (SqlMap == null)
                {
                    SqlMap = SqlMapperCreater.SqlMap;
                }
            }

            /// <summary>
            ///  开始事务
            /// </summary>
            protected void BeginTransaction()
            {
                try
                {
                    SqlMap.BeginTransaction();
                }
                catch
                {
                    SqlMap.RollBackTransaction();
                    SqlMap.BeginTransaction();
                }
            }

            /// <summary>
            /// 提交事务
            /// </summary> 
            protected void CommitTransaction()
            {
                SqlMap.CommitTransaction();
            }

            /// <summary>
            /// 回滚事务
            /// </summary>
            protected void RollBackTransaction()
            {
                SqlMap.RollBackTransaction();
            }

            /// <summary>
            /// 批量保存多个实体.
            /// </summary>
            /// <param name="list">实体列表</param>
            /// <param name="insertCmdId">insert语句的id</param>
            /// <param name="updateCmdId">update语句的id</param>
            /// <param name="deleteCmdId">delete语句的id</param>
            protected void Save(IList<T> list, string insertCmdId, string updateCmdId, string deleteCmdId)
            {
                //删除
                foreach (T t in list)
                {
                    if (t.EntityState == EntityStateEnum.Deleted && !string.IsNullOrEmpty(deleteCmdId))
                    {
                        this.Delete(deleteCmdId, t);
                    }
                }
                //更新
                foreach (T t in list)
                {
                    if (t.EntityState == EntityStateEnum.Modified && !string.IsNullOrEmpty(updateCmdId))
                    {
                        this.Update(updateCmdId, t);
                    }
                }
                //新增
                foreach (T t in list)
                {
                    if (t.EntityState == EntityStateEnum.Added && !string.IsNullOrEmpty(insertCmdId))
                    {
                        this.Insert(insertCmdId, t);
                    }
                }
            }
            /// <summary>
            /// 保单个实体
            /// </summary>
            /// <param name="list">实体列表</param>
            /// <param name="insertCmdId">insert语句的id</param>
            /// <param name="updateCmdId">update语句的id</param>
            /// <param name="deleteCmdId">delete语句的id</param>
            protected void Save(T obj, string insertCmdId, string updateCmdId, string deleteCmdId)
            {
                //删除
                if (obj.EntityState == EntityStateEnum.Deleted && !string.IsNullOrEmpty(deleteCmdId))
                {
                    this.Delete(deleteCmdId, obj);
                }
                //更新
                if (obj.EntityState == EntityStateEnum.Modified && !string.IsNullOrEmpty(updateCmdId))
                {
                    this.Update(updateCmdId, obj);
                }
                //新增
                if (obj.EntityState == EntityStateEnum.Added && !string.IsNullOrEmpty(insertCmdId))
                {
                    this.Insert(insertCmdId, obj);
                }
            }


            /// <summary>
            /// 通用执行Select语句
            /// </summary>
            /// <param name="tag">语句ID</param>
            /// <param name="paramObject">语句所需要的参数</param>
            /// <returns>结果集合</returns>
            protected IList<T> Select(string tag, object paramObject)
            {
                return SqlMap.QueryForList<T>(tag, paramObject);
            }

            /// <summary>
            /// 通用执行skip Select语句
            /// </summary>
            /// <param name="tag">语句ID</param>
            /// <param name="paramObject">语句所需要的参数</param>
            /// <param name="skipResults">忽略个数</param>
            /// <param name="maxResults">最大个数</param>
            /// <returns>结果集合</returns>
            protected IList<T> Select(string tag, object paramObject, int skipResults, int maxResults)
            {
                return SqlMap.QueryForList<T>(tag, paramObject, skipResults, maxResults);
            }

            /// <summary>
            /// 通用执行Select语句
            /// </summary>
            /// <param name="tag">语句ID</param>
            /// <param name="paramObject">语句所需要的参数</param>
            /// <returns>单个结果</returns>
            protected T SelectOne(string tag, object paramObject)
            {
                return SqlMap.QueryForObject<T>(tag, paramObject);
            }

            /// <summary>
            /// 通用执行Update语句(强制检查数据并发)
            /// </summary>
            /// <param name="tag">语句ID</param>
            /// <param name="paramObject">语句所需要的参数</param>
            /// <returns>更新的行数</returns>
            protected int Update(string tag, T paramObject)
            {
                return this.Update(tag, paramObject, true);
            }

            /// <summary>
            /// 通用执行Update语句
            /// </summary>
            /// <param name="tag">语句ID</param>
            /// <param name="paramObject">语句所需要的参数</param>
            /// <returns>更新的行数</returns>
            protected int Update(string tag, object paramObject)
            {
                int iReturn = SqlMap.Update(tag, paramObject);

                // 若更新出现并发且要检查并发，则抛出对应的异常
                if (iReturn <= 0)
                {
                    throw new Exception("数据已被修改，请重新加载.");
                }
                // 改变状态为Unchanged
                return iReturn;
            }

            /// <summary>
            /// 通用执行Update语句
            /// </summary>
            /// <param name="tag">语句ID</param>
            /// <param name="paramObject">语句所需要的参数</param>
            /// <param name="checkConcurrency">是否要检查数据并发</param>
            /// <returns>更新的行数</returns>
            protected int Update(string tag, T paramObject, bool checkConcurrency)
            {
                int iReturn = SqlMap.Update(tag, paramObject);

                // 若更新出现并发且要检查并发，则抛出对应的异常
                if (iReturn <= 0 && checkConcurrency)
                {
                    throw new Exception("数据已被修改，请重新加载.");
                }
                // 改变状态为Unchanged
                paramObject.EntityState = EntityStateEnum.Unchanged;
                return iReturn;
            }
            /// <summary>
            /// 通用执行Update语句
            /// </summary>
            /// <param name="tag">语句ID</param>
            /// <param name="paramObject">语句所需要的参数</param>
            /// <param name="checkConcurrency">是否要检查数据并发</param>
            /// <returns>更新的行数</returns>
            protected int Update(string tag, object paramObject, bool checkConcurrency)
            {
                int iReturn = SqlMap.Update(tag, paramObject);

                // 若更新出现并发且要检查并发，则抛出对应的异常
                if (iReturn <= 0 && checkConcurrency)
                {
                    throw new Exception("数据已被修改，请重新加载.");
                }
                return iReturn;
            }


            /// <summary>
            /// 通用执行Deelte语句
            /// </summary>
            /// <param name="tag">语句ID</param>
            /// <param name="paramObject">语句所需要的参数</param>
            /// <returns>删除的行数</returns>
            protected int Delete(string tag, T paramObject)
            {
                return SqlMap.Delete(tag, paramObject);
            }

            /// <summary>
            /// 通用执行Insert语句
            /// </summary>
            /// <param name="tag">语句ID</param>
            /// <param name="paramObject">语句所需要的参数</param>
            /// <returns>插入行的PK对象</returns>
            protected object Insert(string tag, T paramObject)
            {
                object result = SqlMap.Insert(tag, paramObject);
                paramObject.EntityState = EntityStateEnum.Unchanged;
                return result;
            }

            /// <summary>
            /// 通用执行Insert语句
            /// </summary>
            /// <param name="tag">语句ID</param>
            /// <param name="paramObject">语句所需要的参数</param>
            /// <returns>插入行的PK对象</returns>
            protected object Insert(string tag, object paramObject)
            {
                object result = SqlMap.Insert(tag, paramObject);

                return result;
            }

            #region GetSql/GetDataTable

            /// <summary>
            /// 通用得到参数化后的SQL(xml文件中参数要使用$标记的占位参数)
            /// </summary>
            /// <param name="tag">语句ID</param>
            /// <param name="paramObject">语句所需要的参数</param>
            /// <returns>获得的SQL</returns>
            protected string GetSql(string tag, object paramObject)
            {
                string sql = GetPreparedSql(tag, paramObject);
                //ServiceObject.Log.Logs.DebugLog(tag + ": " + sql);

                return sql;
            }

            /// <summary>
            /// 返回结果集中的第一行的第一列
            /// </summary>
            /// <param name="tag">语句ID</param>
            /// <param name="paramObject">语句所需要的参数</param>
            /// <returns>结果集中的第一行的第一列</returns>
            protected object QueryScalar(string tag, object paramObject)
            {
                bool isSessionLocal = false;
                object result;

                if (SqlMap.LocalSession == null)
                {
                    isSessionLocal = true;
                    SqlMap.OpenConnection();
                }

                //记录SQL语句
                GetSql(tag, paramObject);

                try
                {
                    IDbCommand cmd = GetDbCommand(tag, paramObject);
                    result = cmd.ExecuteScalar();
                }
                catch (Exception ex)
                {
                    throw new Exception("Can't QueryScalar, tag = " + tag, ex);
                }
                finally
                {
                    if (isSessionLocal)
                    {
                        SqlMap.CloseConnection();
                    }
                }

                return result;
            }

            /// <summary>
            /// 通用的以DataSet的方式得到Select的结果(xml文件中参数要使用$标记的占位参数)
            /// </summary>
            /// <param name="tag">语句ID</param>
            /// <param name="paramObject">语句所需要的参数</param>
            /// <returns>得到的DataSet</returns>
            protected DataSet GetDataSet(string tag, object paramObject)
            {
                bool isSessionLocal = false;
                DataSet result = new DataSet(); ;

                if (SqlMap.LocalSession == null)
                {
                    isSessionLocal = true;
                    SqlMap.OpenConnection();
                }
                try
                {
                    IDbCommand cmd = GetDbCommand(tag, paramObject);
                    IDbDataAdapter adapter = SqlMap.LocalSession.CreateDataAdapter(cmd);
                    adapter.Fill(result);
                }
                catch (Exception ex)
                {
                    throw new Exception("Can't GetDataSet, tag = " + tag, ex);
                }
                finally
                {
                    if (isSessionLocal)
                    {
                        SqlMap.CloseConnection();
                    }
                }

                return result;
            }

            /// <summary>
            /// 通用的以DataTable的方式得到Select的结果(xml文件中参数要使用$标记的占位参数)
            /// </summary>
            /// <param name="tag">语句ID</param>
            /// <param name="paramObject">语句所需要的参数</param>
            /// <returns>得到的DataTable</returns>
            protected DataTable GetDataTable(string tag, object paramObject)
            {
                return GetDataSet(tag, paramObject).Tables[0];
            }

            /// <summary>
            /// 通用的以DataTable的方式得到skip Select的结果(xml文件中参数要使用$标记的占位参数)
            /// </summary>
            /// <param name="tag">语句ID</param>
            /// <param name="paramObject">语句所需要的参数</param>
            /// <param name="skipResults">忽略个数</param>
            /// <param name="maxResults">最大个数</param>
            /// <returns>得到的DataTable</returns>
            protected DataTable GetDataTable(string tag, object paramObject, int skipResults, int maxResults)
            {
                bool isSessionLocal = false;
                DataSet result = new DataSet();

                if (SqlMap.LocalSession == null)
                {
                    isSessionLocal = true;
                    SqlMap.OpenConnection();
                }

                //记录SQL语句
                GetSql(tag, paramObject);

                try
                {
                    IDbCommand cmd = GetDbCommand(tag, paramObject);
                    DbDataAdapter adapter = SqlMap.LocalSession.CreateDataAdapter(cmd) as DbDataAdapter;
                    if (adapter == null)
                    {
                        throw new NotSupportedException("Not support skip GetDataTable");
                    }
                    adapter.Fill(result, skipResults, maxResults, "result");
                }
                catch (Exception ex)
                {
                    throw new Exception("Can't GetDataTable, tag = " + tag, ex);
                }
                finally
                {
                    if (isSessionLocal)
                    {
                        SqlMap.CloseConnection();
                    }
                }

                return result.Tables["result"];
            }

            private IDbCommand GetDbCommand(string statementName, object paramObject)
            {
                IStatement statement = SqlMap.GetMappedStatement(statementName).Statement;

                IMappedStatement mapStatement = SqlMap.GetMappedStatement(statementName);

                ISqlMapSession session = new SqlMapSession(SqlMap);

                if (SqlMap.LocalSession != null)
                {
                    session = SqlMap.LocalSession;
                }
                else
                {
                    session = SqlMap.OpenConnection();
                }

                RequestScope request = statement.Sql.GetRequestScope(mapStatement, paramObject, session);
                mapStatement.PreparedCommand.Create(request, session, statement, paramObject);

                IDbCommand command = request.IDbCommand;

                // Ibatis 这里做了个装饰,所以得到的类型不是SqlCommand之类的类型
                // 只能暂时使用反射把它装饰的类型(即真实类型)反射出来
                Type t = command.GetType();
                FieldInfo commandField = t.GetField("_innerDbCommand", BindingFlags.Instance | BindingFlags.NonPublic);
                IDbCommand innerDbCommand = commandField.GetValue(command) as IDbCommand;

                return innerDbCommand; // request.IDbCommand;
            }

            /// <summary>
            /// 获取查询语句
            /// </summary>
            /// <param name="statementName"></param>
            /// <param name="parameterObject"></param>
            /// <returns></returns>
            protected string GetPreparedSql(string statementName, object parameterObject)
            {
                IMappedStatement mappedStatement = SqlMap.GetMappedStatement(statementName);
                ISqlMapSession localSession = SqlMap.LocalSession;
                IStatement statement = mappedStatement.Statement;
                if (localSession == null)
                {
                    localSession = new SqlMapSession(SqlMap);
                }
                return statement.Sql.GetRequestScope(mappedStatement, parameterObject, localSession).PreparedStatement.PreparedSql;
            }

            protected IList<TableEntity> QueryWithRowDelegate(string tag, object paramObject, Action<object, object, IList<TableEntity>> action)
            {
                return SqlMap.QueryWithRowDelegate<TableEntity>(tag, paramObject, new RowDelegate<TableEntity>(action));
            }
            #endregion
        }


            /// <summary>
            /// 实体基类
            /// </summary>
            [Serializable]
            public class EntityBase
            {
                // Fields
                protected EntityBase OldValue;

                protected EntityStateEnum _entityState = EntityStateEnum.Unchanged;
                /// <summary>
                /// 实体的数据版本,默认为未改变
                /// </summary>
                public EntityStateEnum EntityState
                {
                    get { return _entityState; }
                    set { _entityState = value; }
                }

                /// <summary>
                /// 默认构造函数
                /// </summary>
                protected EntityBase()
                {

                }

                /// <summary>
                /// 实现克隆接口
                /// </summary>
                /// <returns></returns>
                public virtual object Clone()
                {
                    MemoryStream serializationStream = new MemoryStream();
                    BinaryFormatter formatter = new BinaryFormatter();
                    formatter.Serialize(serializationStream, this);
                    serializationStream.Position = 0;
                    return formatter.Deserialize(serializationStream);
                }

                /// <summary>
                /// 在实体与数据表做相互转换时,制定表的列名称模式
                /// </summary>
                public enum ColumnNameEnum
                {
                    /// <summary>
                    /// 数据库对应列名称
                    /// </summary>
                    DBName = 1,
                    /// <summary>
                    /// 实体对应字段名称
                    /// </summary>
                    PropertyName = 2
                }
            }

            public enum EntityStateEnum
            {
                /// <summary>
                /// 新增
                /// </summary>
                Added = 1,
                /// <summary>
                /// 被修改
                /// </summary>
                Modified = 2,
                /// <summary>
                /// 被删除
                /// </summary>
                Deleted = 3,
                /// <summary>
                /// 未修改
                /// </summary>
                Unchanged = 4,
                /// <summary>
                /// 新增的但是未加入任何table中
                /// </summary>
                Detached = 5
            }

            [Serializable]
            public class TableEntity : EntityBase
                {
                    public long ID { get; set; }
                    public int COL_1 { get; set; }
                    public int COL_2 { get; set; }
                    public int COL_3 { get; set; }
                    public DateTime REFRESH_DATE { get; set; }
                }


                public class TableAccess : DaoBase<TableEntity>
                {
                    public object Insert(TableEntity obj)
                    {
                        return base.Insert("TableEntity_Insert", obj);
                    }

                    public IList<TableEntity> Select(TableEntity obj)
                    {
                        return base.Select("TableEntity_Select", obj);
                    }

                    public IList<TableEntity> SelectWithRowDelegate(TableEntity obj)
                    {
                        return base.QueryWithRowDelegate("TableEntity_Select", obj, new Action<object, object, IList<TableEntity>>(RowDelegate));
                    }

                    public DataTable GetDataTable(TableEntity obj)
                    {
                        return base.GetDataTable("TableEntity_Select_Datatable", obj);
                    }

                    public void RowDelegate(object obj, object parameterObject, IList<TableEntity> list)
                    {
                        TableEntity tb = obj as TableEntity;


                        tb.COL_1 = 77;
                        list.Add(tb);
                    }
                }
            
            
    }
