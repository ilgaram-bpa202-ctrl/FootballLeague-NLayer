using System.Linq.Expressions;

namespace FootballLeague.Core.Repositories
{
    // <T> burada Generic (Ümumi) deməkdir. Yəni T yerinə Team, Player və ya Match gələ bilər.
    // where T : class o deməkdir ki, T ancaq bir Class ola bilər (int, string ola bilməz).
    public interface IGenericRepository<T> where T : class
    {
        Task<T> GetByIdAsync(int id); // İD-yə görə 1 dənə məlumat gətir
        Task<IEnumerable<T>> GetAllAsync(); // Bütün siyahını gətir
        IQueryable<T> Where(Expression<Func<T, bool>> expression); // Şərtə görə gətir (məs: ancaq xalı 5-dən çox olanlar)
        Task AddAsync(T entity); // Baza-ya yeni məlumat əlavə et
        void Update(T entity); // Məlumatı yenilə
        void Remove(T entity); // Məlumatı sil
    }
}