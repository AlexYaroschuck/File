using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using FileManager.BL.Objects.File;
using PM.DAL;

namespace FileManager.DAL.Repositories
{
    public class FIleRepository
    {
        public List<MyFile> Get(object data)
        {
            using (var multi = Repository.GetConnection().QueryMultiple("dbo.FileGet", data, commandType: CommandType.StoredProcedure))
            {
                return multi.Read<MyFile>().ToList();
            }
        }

        public void Modify(MyFile file)
        {
            Repository.GetConnection().Query("dbo.FileUpdate", new
            {
                file.Date
            }, commandType: CommandType.StoredProcedure);
        }

        public void Delete(object obj)
        {
            Repository.GetConnection().ExecuteAsync("dbo.FileDelete", obj, commandType: CommandType.StoredProcedure, commandTimeout: int.MaxValue);
        }

    }
}
