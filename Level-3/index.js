const todoList=()=>{
    all=[];
    const add =(todoItem)=>{
        all.push(todoItem);
    }
    const markAsCompleted=(index)=>{
        all[index].completed=true;
    }
    const overdue=()=>{
        const today = new Date();
        return all.filter(item => !item.completed && new Date(item.dueDate)<today);
    }
    const dueToday=()=>{
        const today = new Date();
        return all.filter(item => !item.completed && new Date(item.dueDate).toISOString().split("T")[0] === formattedDate(today));
    }
    const dueLater=()=>{
        const today = new Date();
        return all.filter(item => !item.completed && new Date(item.dueDate)>today);
    }
    const toDisplayableList=(list)=>{
        return list.map(item => {
            const checkbox = item.completed ? '[x]' : '[ ]';
            return `${checkbox} ${item.title} ${formattedDate(new Date(item.dueDate))}`;
        });
    }
    return {all, add, markAsCompleted, overdue, dueToday, dueLater, toDisplayableList};
}
const todos =todoList();
const formattedDate = d => {
    return d.toISOString().split("T")[0]; 
}
var dateToday = new Date();
const today =formattedDate(dateToday);
const yesterday =formattedDate(
    new Date(new Date().setDate(dateToday.getDate() - 1)) )
const tomorrow =formattedDate(
    new Date(new Date().setDate(dateToday.getDate() + 1))
)
todos.add({ title: 'Submit assignment', dueDate: yesterday, completed: false });
todos.add({ title: 'Pay rent', dueDate: today, completed: true });
todos.add({ title: 'Service Vehicle', dueDate: today, completed: false });
todos.add({ title: 'meet friend', dueDate: today, completed: false });
todos.add({ title: 'File taxes', dueDate: tomorrow, completed: false });
todos.add({ title: 'Pay electric bill', dueDate: tomorrow, completed: false });
console.log("My Todo-list\n\n");
console.log("Overdue");
var overdues =todos.overdue();
todos.markAsCompleted(2);
var formattedOverdues =todos.toDisplayableList(overdues);
console.log(formattedOverdues);
console.log("\n");
console.log("\n");
console.log("Due Today");
let itemsDueToday =todos.dueToday();
let formattedItemsDueToday =todos.toDisplayableList(itemsDueToday);
console.log(formattedItemsDueToday);
console.log("\n");
console.log("\n");
console.log("Due Later");
let itemsDueLater=todos.dueLater();
let formattedItemsDueLater =todos.toDisplayableList(itemsDueLater);
console.log(formattedItemsDueLater);
console.log("\n");
console.log("\n");
