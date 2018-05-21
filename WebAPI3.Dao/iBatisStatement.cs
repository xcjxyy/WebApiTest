using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI3.Dao
{
    public class iBatisStatement
    {
        public string StatementName { get; set; }

        public object ParameterObject { get; set; }

        public SqlExecuteType Type { get; set; }
    }

    public enum SqlExecuteType
    {
        INSERT,
        UPDATE,
        DELETE
    }
}
