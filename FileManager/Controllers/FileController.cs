using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using FileManager.BL.Objects.File;
using FileManager.BL.Services.Implementation;
using Newtonsoft.Json;

namespace FileManager.Controllers
{
    
    public class FileController : ApiController
    {
        private readonly FileService _service = new FileService();

        [Route("file/{id:guid}")]
        [HttpGet]
        public string GetByID(Guid id)
        {
           return JsonConvert.SerializeObject(_service.GetByID(id));
        }

        [Route("file")]
        [HttpGet]
        public string GetAll()
        {
            return JsonConvert.SerializeObject(_service.GetByAll());
        }

        [Route("file")]
        [HttpPut]
        public void Modify(MyFile file)
        {
            _service.Modify(file);
        }

        [Route("file")]
        [HttpPost]
        public void Create(MyFile file)
        {
            _service.Modify(file);
        }

        [Route("file/{id:guid}")]
        [HttpDelete]
        public void Delete(Guid id)
        {
            _service.Delete(id);
        }
    }
}
