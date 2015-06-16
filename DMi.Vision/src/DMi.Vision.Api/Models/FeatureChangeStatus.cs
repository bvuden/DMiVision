using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMi.Vision.Models;

namespace DMi.Vision.Api.Models
{
    public class FeatureChangeStatus
    {
        public FeatureChangeStatus(string title, FeatureStatus status)
        {
            Title = title;
            Status = status;
        }
        //public int Id { get; set; }
        public string Title { get; set; }
        public FeatureStatus Status { get; set; }
    }
}
