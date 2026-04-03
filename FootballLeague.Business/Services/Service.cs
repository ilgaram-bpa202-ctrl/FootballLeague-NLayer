using FootballLeague.Core.Repositories;
using FootballLeague.Core.Services;
using FootballLeague.Core.UnitOfWorks; 

namespace FootballLeague.Business.Services
{
    public class Service<T> : IService<T> where T : class
    {
        protected readonly IGenericRepository<T> _repository;
        protected readonly IUnitOfWork _unitOfWork; 

        public Service(IGenericRepository<T> repository, IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<T> AddAsync(T entity)
        {
            await _repository.AddAsync(entity);
            await _unitOfWork.CommitAsync(); 
            return entity;
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task RemoveAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity != null)
            {
                _repository.Remove(entity);
                await _unitOfWork.CommitAsync();
            }
        }

        public async Task UpdateAsync(T entity)
        {
            _repository.Update(entity);
            await _unitOfWork.CommitAsync();
        }
    }
}