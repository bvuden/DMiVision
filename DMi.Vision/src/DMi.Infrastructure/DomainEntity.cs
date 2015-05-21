using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMi.Infrastructure
{
    /// <summary>
    /// Serves as the base class for all entities in the system.
    /// </summary>
    /// <typeparam name="T">The type of the key for the entity.</typeparam>
    public abstract class DomainEntity<T>
    {
        /// <summary>
        /// Gets or sets the unique ID of the entity in the underlying data store.
        /// </summary>
        public T Id { get; set; }

        /// <summary>
        /// Checks if the current domain entity has an identity.
        /// </summary>
        /// <returns>True if the domain entity is transient (i.e. has no identity yet), false otherwise.</returns>
        public bool IsTransient()
        {
            return Id.Equals(default(T));
        }
    }
}
