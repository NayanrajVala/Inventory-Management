import { useState,useEffect } from "react";
import api from "../api";
import { CategoryInterface } from "../types/Category";


export default function Category(){
    const [category,setCategory] = useState<CategoryInterface[]>([])
    const [name,setName] = useState("")

    const fetchCategories = async()=>{
        try{
            const res = await api.get<CategoryInterface[]>("/category");
            setCategory(res.data);  
        }
    catch(err:any){
        alert("Failed To fetch category");
    }
}

    const handleCreate=async()=>{
        try {
            await api.post('/category',{name});
            setName("");// it first clears input
            fetchCategories(); // then fetches all category
        } catch (err:any) {
            alert(err.response?.data?.message || "creation failed");
        }
    }

    useEffect(()=>{
        fetchCategories ();
    },[]);


    return (
        <div>
            <h2>Category Page</h2>

            <input placeholder="Category Name"
            value={name} 
            onChange={(e)=>setName(e.target.value)}/>

            <button onClick={handleCreate}>Create</button>
            {/* <button></button> */}

            <hr />
            <ul>
                {category.map((c)=>(
                    <li key={c.id}>{c.name}</li>
                ))}
            </ul>
        </div>
    );
}