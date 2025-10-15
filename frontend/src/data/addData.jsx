import { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { BiLoaderAlt } from "react-icons/bi";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { MdOutlinePriceCheck } from "react-icons/md";
import { TbCircleLetterC } from "react-icons/tb";
import { BiCategory } from "react-icons/bi";
import { URL } from "../URL";

const AddData = () => {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [company, setCompany] = useState("");
    const [file, setFile] = useState();

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    //  console.log(name,price,category,company,file);
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!name || !price || !company || !category || !file) {
                setError(true);
                return;
            }
            else if (name.trim() || price.trim() || company.trim() || file.trim()) {
                setLoading(true);
                const formData = new FormData();
                formData.append("name", name);
                formData.append("price", price);
                formData.append("company", company);
                formData.append("category", category);
                formData.append("file", file);
                // console.log([...formData]);
                let result = await fetch(`${URL}/data/addData`, {
                    method: "post",
                    body: formData
                });

                let data = await result.json();
                if (data.success) {
                    navigate("/");
                    setLoading(false);
                    toast.success("data added...");
                }
                else {
                    setLoading(false);
                    toast.error("data not add...");
                }
            }
            else {
                setLoading(false);
                toast.warn("white space is not allowed...");
            }
        }
        catch (err) {
            setLoading(false);
            toast.error("something went wrong...");
        }
    }

    return (
            <div className="signup">
                <p className="heading1">AddData</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-box1">
                        <MdOutlineDriveFileRenameOutline className="icon" /><input type="text" placeholder="Enter product name..." value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    {error && !name && <p className="error-text">Enter Name</p>}
                    <div className="input-box1">
                        <MdOutlinePriceCheck className="icon" /><input type="number" placeholder="Enter product price..." value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    {error && !price && <p className="error-text">Enter price</p>}
                    <div className="input-box1">
                        <TbCircleLetterC className="icon" /><input type="text" placeholder="Enter category name..." value={category} onChange={(e) => setCategory(e.target.value)} />
                    </div>
                    {error && !category && <p className="error-text">Enter category Name</p>}
                    <div className="input-box1">
                        <BiCategory className="icon" /><input type="text" placeholder="Enter company name..." value={company} onChange={(e) => setCompany(e.target.value)} />
                    </div>
                    {error && !company && <p className="error-text">Enter company Name</p>}
                    <div>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    </div>
                    {error && !file && <p className="error-text">upload file</p>}
                    <div>
                        <button type="submit" className="submit-btn" disabled={loading}>{loading?<span>Adding...<BiLoaderAlt className="loading-icon" /></span>:"Add"}</button>
                    </div>
                </form>
            </div>
    );
}

export default AddData;