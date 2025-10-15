import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import { BiLoaderAlt } from "react-icons/bi";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { MdOutlinePriceCheck } from "react-icons/md";
import { TbCircleLetterC } from "react-icons/tb";
import { BiCategory } from "react-icons/bi";
import { URL } from "../URL";

const EditData = () => {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [company, setCompany] = useState("");
    const [file, setFile] = useState();
    const [oldFile, setOldFile] = useState("");

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const param = useParams();
    let navigate = useNavigate();
    let index = param.id;

    const getSingleData = async () => {
        let result = await fetch(`${URL}/data/getSingleData/${index}`);
        let data = await result.json();
        let d1 = data?.data;
        setName(d1?.name);
        setPrice(d1?.price);
        setCompany(d1?.company);
        setCategory(d1?.category);
        setOldFile(d1?.file);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!name || !price || !company || !category || !oldFile) {
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
                if (file) {
                    formData.append("file", file);
                }
                formData.append("oldFile", oldFile);
                //  console.log([...formData]);
                let result = await fetch(`${URL}/data/updateSingleData/${index}`, {
                    method: "put",
                    body: formData
                });

                let data = await result.json();
                if (data.success) {
                    navigate("/");
                    setLoading(false);
                    toast.success("data updated...");
                }
                else {
                    setLoading(false);
                    toast.error("data not update...");
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


    useEffect(() => {
        getSingleData();
    }, []);


    return (
            <div className="signup">
                <p className="heading1">EditData</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-box1">
                        <MdOutlineDriveFileRenameOutline className="icon" /><input type="text" placeholder="Enter product name..." value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    {error && !name && <p className="error-text">Enter Name</p>}
                    <div className="input-box1">
                        <MdOutlinePriceCheck className="icon" /><input type="number" placeholder="Enter product price..." value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    {error && !price && <p className="error-text">Enter Price</p>}
                    <div className="input-box1">
                        <TbCircleLetterC className="icon" /><input type="text" placeholder="Enter category name..." value={category} onChange={(e) => setCategory(e.target.value)} />
                    </div>
                    {error && !category && <p className="error-text">Enter Category Name</p>}
                    <div className="input-box1">
                        <BiCategory className="icon" /><input type="text" placeholder="Enter company name..." value={company} onChange={(e) => setCompany(e.target.value)} />
                    </div>
                    {error && !company && <p className="error-text">Enter Company Name</p>}
                    <div className="file-box">
                        <div className="file-box1"><input type="file" onChange={(e) => setFile(e.target.files[0])} /></div>
                        <div className="file-box2"><img src={`${URL}/uploads/${oldFile}`} alt="" /></div>
                        <input type="hidden" value={oldFile} />
                    </div>
                    <div>
                        <button type="submit" className="submit-btn" disabled={loading}>{loading?<span>Updating...<BiLoaderAlt className="loading-icon" /></span>:"Update"}</button>
                    </div>
                </form>
            </div>
    );
}

export default EditData;