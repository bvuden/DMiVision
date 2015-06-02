using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMi.Vision.Models
{
    public class Vote
    {
        private string _voterId;
        private int _points;

        public Vote() { }

        public Vote(string voterId, int points)
        {
            _voterId = voterId;
            _points = points;
        }
        public int Id { get; set; }
        /// <summary>
        /// unique identifier of user in the system
        /// </summary>
        public string VoterId
        {
            get { return _voterId; }
            set { _voterId = value; }
        }
        public int Points
        {
            get { return _points; }
            set { _points = value; }
        }

        public Feature Feature { get; set; }
        public int FeatureId { get; set; }
    }
}
