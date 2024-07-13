import PropTypes from 'prop-types'
const SearchBox = ({setQuery}) => {
    return (
        <div>
            <div className="form-control">
                <input onChange={(e) => setQuery(e.target.value.toLowerCase())} type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
            </div>
        </div>
    );
};

SearchBox.propTypes = {
    setQuery: PropTypes.func.isRequired,
}

export default SearchBox;