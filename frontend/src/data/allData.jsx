import { MdDeleteForever } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Link } from 'react-router';
import { URL } from "../URL";
import { toast } from 'react-toastify';

const AllData = () => {

    const [value, setValue] = useState([]);
    const [sorted, setSorted] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSorted = (e) => {
        setSorted(e.target.value);
    }

    const getdata = async () => {
        try {
            setLoading(true);
            let url = `${URL}/data/getData?`;
            if (sorted == "asc") {
                url += `price=asc`;
            }
            if (sorted == "desc") {
                url += `price=desc`;
            }

            let result = await fetch(url);
            let data = await result.json();
            if (data.success) {
                setValue(data.data);
                setLoading(false);
            }
            else {
                setLoading(false);
            }
        }
        catch (err) {
            toast.error("something went wrong");
            setLoading(false);
        }
    }

    useEffect(() => {
        getdata();
    }, [sorted]);

    const handleSearch = async (e) => {
        let key = e.target.value;
        if (key) {
            let result = await fetch(`${URL}/data/search/${key}`);
            let data = await result.json();
            setValue(data.result);
        }
        else {
            getdata();
        }
    }

    const handleDelete = async (index) => {
        let delData = confirm("are you sure");
        if (delData) {
            let result = await fetch(`${URL}/data/deleteSingleData/${index}`, {
                method: "delete"
            });
            let data = await result.json();
            if (data.success) {
                getdata();
                toast.success("data deleted");
            }
        }
        else {
            toast.error("data not delete...");
        }
    }

    return (
        <div className="allData-main">
            <p className="heading">All Data</p>
            <form className="allData-form">
                <div>
                    <input type="search" onChange={handleSearch} placeholder="search here..." />
                </div>
                <div>
                    <select name="" id="" value={sorted} onChange={handleSorted}>
                        <option value="">All</option>
                        <option value="asc">Price (ascending)</option>
                        <option value="desc">Price (descending)</option>
                    </select>
                </div>
            </form>
            <div className="allData-main-child">
                {loading ? <div className="loader-img"><img src="./images/loader.gif" alt="" /></div> :
                    <div className="allData">
                        <>
                            {value.length ?
                                value.map((v, i) => {
                                    return (
                                        <div className="card" key={v._id}>
                                            <div className="card-child1"><img src={`${URL}/uploads/${v.file}`} alt="broken image" /></div>
                                            <div className="card-child2">
                                                <div className="card-text">
                                                    <div className="card-text-child1">Name:</div>
                                                    <div className="card-text-child2">{v.name.length > 8 ? v.name.slice(0, 7) + ".." : v.name}</div>
                                                </div>
                                                <div className="card-text">
                                                    <div className="card-text-child1">Price:</div>
                                                    <div className="card-text-child2">${(String(v.price).length > 7 ? String(v.price).slice(0, 6) + ".." : v.price)}</div>
                                                </div>
                                                <div className="card-text">
                                                    <div className="card-text-child1">Category:</div>
                                                    <div className="card-text-child2">{v.category.length > 8 ? v.category.slice(0, 7) + ".." : v.category}</div>
                                                </div>
                                                <div className="card-text">
                                                    <div className="card-text-child1">Company:</div>
                                                    <div className="card-text-child2">{v.company.length > 8 ? v.company.slice(0, 7) + ".." : v.company}</div>
                                                </div>
                                            </div>
                                            <div className="card-child3">
                                                <div className="icon-btn" onClick={() => handleDelete(v._id)}><MdDeleteForever /></div>
                                                <div className="icon-btn"><Link to={`/edit/${v._id}`}><FiEdit /></Link></div>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <p className="no-data">Data not found</p>
                            }
                        </>
                    </div>
                }
            </div>
        </div>
    );
};
export default AllData;