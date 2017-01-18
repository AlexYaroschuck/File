using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FileManager.BL.Objects.File;
using FileManager.DAL.Repositories;

namespace FileManager.BL.Services.Implementation
{
    public class FileService
    {
        private readonly FIleRepository _repository = new FIleRepository();

        public MyFile GetByID(Guid id)
        {
           return _repository.Get(new {id = id}).FirstOrDefault();
        }

        public List<MyFile> GetByAll()
        {
            return _repository.Get(new {});
        }

        public void Modify(MyFile file)
        {
            _repository.Modify(file);
        }

        public void Create(MyFile file)
        {
            _repository.Modify(file);
        }

        public void Delete(Guid id)
        {
            _repository.Delete(new {id = id});
        }
    }
}
