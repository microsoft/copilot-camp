using Microsoft.Agents.Core.Models;
  
namespace ContosoHRAgent
{
    public class FileReference(string fileId, string fileName, string quote, Citation citation)
    {
        public string FileId { get; set; } = fileId;
        public string FileName { get; set; } = fileName;
        public string Quote { get; set; } = quote;
        public Citation Citation { get; set; } = citation;
    }
}

