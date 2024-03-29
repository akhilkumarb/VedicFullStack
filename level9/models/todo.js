'use strict'
const { Sequelize, Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }

    static addTodo ({ title, dueDate }) {
      return this.create({ title, dueDate, completed: false })
    }

    static getTodos () {
      return this.findAll()
    }

    static async Overdue() {
      return this.findAll({
        where: {
          dueDate: {
            [Sequelize.Op.lte]: new Date()
          },
          completed: false
        }
      });
    }
    

    static async dueLater () {
      return this.findAll({
        where: {
          dueDate: {
            [Sequelize.Op.gte]: new Date()
          },
          completed:false
        }
      })
    }

    static async dueToday () {
      return this.findAll({
        where: {
          dueDate: {
            [Sequelize.Op.eq]: new Date()
          },
          completed:false
        }
      })
    }

    static async remove(id){
      return this.destroy({
        where:{
          id,
        },
      });
    }
    static async completedTodos(){
      return this.findAll({
        where:{
           completed:true
        }
      })
    }
    markAsCompleted () {
      return this.update({ completed: true })
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo'
  })
  return Todo
}
