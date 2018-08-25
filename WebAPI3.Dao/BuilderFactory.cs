using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI3.Dao
{
    public static class BuilderFactory
    {
        public static SqlAdapter Default()
        {
            SqlAdapter sad=new SqlAdapter();
            return sad;
        }
    }
}
