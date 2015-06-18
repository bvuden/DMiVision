using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMi.Vision.Models
{
    public enum FeatureStatus
    {
        UnderReview,
        Planned,
        Started,
        Completed,
        Declined
    }

    public static class FeatureStatusExtensions
    {
        public static string ToFriendlyString(this FeatureStatus status)
        {
            switch (status)
            {
                case FeatureStatus.UnderReview:
                    return "Under Review";
                case FeatureStatus.Planned:
                    return "Planned";
                case FeatureStatus.Started:
                    return "Started";
                case FeatureStatus.Completed:
                    return "Completed";
                case FeatureStatus.Declined:
                    return "Declined";
                default:
                    throw new ArgumentException($"{status} is an unknown status.");
            }
        }

    }

}
