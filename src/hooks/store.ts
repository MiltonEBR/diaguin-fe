import { useState, useEffect } from 'react';
import {
  addDays,
  closestTo,
  getDay,
  isBefore,
  parseJSON,
  startOfToday,
} from 'date-fns';
import { Goal, GoalRawData, Project, StoreData } from '../Types';
import projectsService from '../Services/projects';
import goalsServices from '../Services/goals';

const getClosestDate = (goal: GoalRawData): string | null => {
  const { dates, repeat } = goal;
  if (dates.length <= 0) return null;

  const todayDate = startOfToday();
  const todayDay = getDay(todayDate);

  if (repeat) {
    const next = Number(
      dates.find((date) => todayDay >= Number(date)) || dates[0],
    );

    return addDays(
      todayDate,
      todayDay <= next ? next - todayDay : 6 - todayDay + next,
    ).toJSON();
  }

  const ds: Date[] = dates
    .filter((date) => !isBefore(parseJSON(date), todayDate))
    .map((date) => parseJSON(date));
  return ds.length > 0 ? closestTo(todayDate, ds).toJSON() : null;
};

function Store(): StoreData {
  const [projects, setProjects] = useState<Project[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const getProjects = async (): Promise<void> => {
      const res = await projectsService.getAll();
      setProjects(res);
    };
    getProjects();
  }, []);

  useEffect(() => {
    if (!projects) return;
    const getGoals = (): void => {
      for (let i = 0; i < projects.length; i += 1) {
        projects[i].goalsId.forEach(async (goalId) => {
          const goal = await goalsServices.getById(goalId);
          setGoals((prev) => [
            ...prev,
            { ...goal, nextDate: getClosestDate(goal) },
          ]);
        });
      }
    };
    getGoals();
  }, [projects]);

  return { projects, goals };
}

export default Store;
