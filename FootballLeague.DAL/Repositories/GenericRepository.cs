using FootballLeague.Core.Repositories;
using FootballLeague.DAL.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FootballLeague.DAL.Repositories
{
    // Bu class IGenericRepository interfeysindən miras alır və onun tələb etdiyi metodları doldurur
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        private readonly DbSet<T> _dbSet;

        // Constructor: Context-i (Baza bağlantısını) bura çağırırıq
        public GenericRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>(); // Hansı cədvəllə işləyəcəyimizi təyin edir (Məs: T Team-dirsə, Teams cədvəli olur)
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            // AsNoTracking() performansı artırır, çünki sadəcə oxumaq üçün çəkirik, dəyişiklik etməyəcəyik
            return await _dbSet.AsNoTracking().ToListAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public void Remove(T entity)
        {
            _dbSet.Remove(entity);
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public IQueryable<T> Where(Expression<Func<T, bool>> expression)
        {
            return _dbSet.Where(expression);
        }
    }
}