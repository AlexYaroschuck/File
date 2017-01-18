using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PM.DAL
{
    internal static class Repository
    {
        /// <summary>
        /// Repository instance to work with.
        /// </summary>
        public enum Instance
        {
            /// <summary>
            /// Primary read/write DB.
            /// </summary>
            Primary,
            /// <summary>
            /// Crawlers read-only DB.
            /// </summary>
            Crawlers,
            /// <summary>
            /// Read-only DB.
            /// </summary>
            ReadOnly,
            /// <summary>
            /// Read-only 2 DB. WTH is this?
            /// </summary>
            ReadOnly2,
            /// <summary>
            /// Logging DB.
            /// </summary>
            Logging
        }

        internal static DbConnection GetConnection(Instance dc = Instance.Primary)
        {
            var factory = DbProviderFactories.GetFactory("System.Data.SqlClient");
            var conn = factory.CreateConnection();

            if (conn == null)
                return null;

            conn.ConnectionString = GetDatabaseConnection(dc);
            //conn.Open();

            return conn;
        }

        /// <summary>
        /// Get a specific DB connection string from the configuration file.
        /// </summary>
        /// <param name="dc">The dc.</param>
        /// <returns>System.String.</returns>
        public static string GetDatabaseConnection(Instance dc = Instance.Primary)
        {
            return ConfigurationManager.ConnectionStrings["ConnectionString." + dc].ConnectionString;
        }
    }
}
