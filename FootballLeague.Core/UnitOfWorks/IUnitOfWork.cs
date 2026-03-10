namespace FootballLeague.Core.UnitOfWorks
{
    public interface IUnitOfWork
    {
        // Verilənlər bazasına bütün dəyişiklikləri bir dəfəyə yazmaq üçün
        Task CommitAsync();
        void Commit();
    }
}