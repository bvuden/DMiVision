using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using DMi.Vision.Models;

namespace DMi.Vision.Api.Models
{
    public class UserInfo
    {
        private ClaimsPrincipal _user;
        private VisionContext _dbContext;

        public UserInfo(ClaimsPrincipal user, VisionContext dbContext)
        {
            _user = user;
            _dbContext = dbContext;
        }

        /// <summary>
        /// Unique identifier of the currently logged in user
        /// </summary>
        public string UserId => _user.Claims.FirstOrDefault(x => x.Type == "sub").Value;
        
        public string Name { get; set; }

        /// <summary>
        /// Amount of vote points available to the currently logged in user
        /// </summary>
        public int AvailableVotePoints
        {
            get
            {
                //todo make max amount configurable
                const int maxPoints = 100;

                // get spend vote points
                var userVotes = _dbContext.Votes.Include(x=>x.Feature).Where(v => v.VoterId == UserId);
                int spentPoints = 0;
                foreach (var vote in userVotes)
                {
                    if (vote.Feature.Status == FeatureStatus.UnderReview) {
                        spentPoints += vote.Points;
                    }

                }
                //var activeVotes = userVotes.Where(v => v.Feature.Status == FeatureStatus.UnderReview);
                //var spentPoints = activeVotes?.Sum(x => x.Points) ?? 0;                
                return maxPoints - spentPoints;
            }
        }

        public bool IsAdmin { get; internal set; }
    }
}
