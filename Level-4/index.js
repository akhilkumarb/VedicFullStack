const todoList=()=>{
    all=[]
    const add =(todoItem)=>{
        all.push(todoItem);
    }
    const markAsCompleted=(index)=>{
        all[index].completed=true;
    }
    const overdue=()=>{
        const today = new Date();
        return all.filter(item => !item.completed && new Date(item.dueDate) < today);
    }
    const dueToday=()=>{
        const today = new Date();
        return all.filter(item => !item.completed && new Date(item.dueDate).toISOString().split("T")[0] === formattedDate(today));
    }
    const dueLater=()=>{
        const today = new Date();
        return all.filter(item => !item.completed && new Date(item.dueDate) > today);
    }
    const toDisplayableList=(list)=>{
        return list.map(item => {
            const checkbox = item.completed ? '[x]' : '[ ]';
            return `${checkbox} ${item.title} ${formattedDate(new Date(item.dueDate))}`;
        });
    }
    return {all,add,markAsCompleted,overdue,dueToday,dueLater,toDisplayableList};
}
module.exports=todoList;
