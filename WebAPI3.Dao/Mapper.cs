﻿using IBatisNet.Common.Utilities;
using IBatisNet.DataMapper;
using IBatisNet.DataMapper.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI3.Dao
{
    public class Mapper
    {
        private static volatile ISqlMapper _mapper = null;

        protected static void Configure(object obj)
        {
            _mapper = null;
        }

        protected static void InitMapper()
        {
            ConfigureHandler handler = new ConfigureHandler(Configure);
            DomSqlMapBuilder builder = new DomSqlMapBuilder();
            _mapper = builder.ConfigureAndWatch(handler);
        }

        public static ISqlMapper Instance()
        {
            if (_mapper == null)
            {
                lock (typeof(SqlMapper))
                {
                    if (_mapper == null) // double-check
                    {
                        InitMapper();
                    }
                }
            }
            return _mapper;
        }

        public static ISqlMapper Get()
        {
            return Instance();
        }


        /// <summary>
        /// RealMarket Mapper
        /// </summary>
        public static ISqlMapper GetMaper
        {
            get
            {
                if (_mapper == null)
                {
                    lock (typeof(ISqlMapper))
                    {
                        if (_mapper == null)
                        {
                            ConfigureHandler hander = new ConfigureHandler(Configure);
                            DomSqlMapBuilder builder = new DomSqlMapBuilder();
                            _mapper = builder.ConfigureAndWatch("SqlMap.config", hander);
                        }
                    }
                }
                return _mapper;
            }
        }
    }
}
