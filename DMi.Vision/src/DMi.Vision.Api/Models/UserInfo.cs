using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

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
        public string UserId
        {
            get
            {
                Claim subject = _user.Claims.FirstOrDefault(x => x.Type == "sub");
                return subject.Value;
            }
        }


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
                var userVotes = _dbContext.Votes.Where(v => v.VoterId == UserId);
                var spentPoints = userVotes != null ? userVotes.Sum(x => x.Points) : 0;

                return maxPoints - spentPoints;
            }
        }
    }
}
