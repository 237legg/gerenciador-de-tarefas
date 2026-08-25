import React from 'react';

type Task = {
  id: string;
  title: string;
};

type ColumnProps = {
  name = string;
  tasks? = Task[];
};

export function Column({name, tasks = []}: ColumnProps){
  return(
    
  )
}