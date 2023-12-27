'use client';

import * as React from 'react';

import { FormProvider, useForm } from 'react-hook-form';

import { NKConfig } from '@/core/NKConfig';
import NKForm, { NKFormType } from '@/core/components/form/NKForm';
import { IMenuItem, useMenuDashboard } from '@/core/contexts/MenuDashboardContext';

interface ISearchForm {
  search: string;
}

const defaultValues: ISearchForm = {
  search: '',
};

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const formMethods = useForm<ISearchForm>({
    defaultValues,
  });
  const searchForm = formMethods.watch('search');
  const { menu } = useMenuDashboard();
  const [menuItem, setMenuItem] = React.useState<IMenuItem[]>([]);

  React.useEffect(() => {
    setMenuItem(menu);
  }, [menu]);

  React.useEffect(() => {
    if (searchForm) {
      const newMenu = menu.filter((item) => {
        if (item.label.toLowerCase().includes(searchForm.toLowerCase())) {
          return true;
        }
        if (item.children?.length !== 0) {
          const newChildren = item.children?.filter((child) => {
            if (child.label.toLowerCase().includes(searchForm.toLowerCase())) {
              return true;
            }
            return false;
          });
          if (newChildren?.length !== 0) {
            return true;
          }
        }
        return false;
      });
      setMenuItem(newMenu);
    } else {
      setMenuItem(menu);
    }
  }, [searchForm]);

  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-xl">
        <FormProvider {...formMethods}>
          <NKForm
            label="Tìm kiếm"
            name="search"
            type={NKFormType.TEXT}
            fieldProps={{
              placeholder: 'Tìm kiếm',
            }}
          />
        </FormProvider>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {menuItem.map((item) => {
          return (
            <>
              {item.children?.length !== 0 && (
                <div key={item.key} className="p-4 text-black bg-white border rounded-xl">
                  <h2 className="flex gap-4">
                    <div className="flex items-center justify-center w-5 h-5">{item.icon}</div>
                    {item.label}
                  </h2>
                  <div className="w-full h-[1px] my-4 bg-gray-600"></div>
                  <div className="pl-2 ">
                    {!Boolean(item.children) && (
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          item.onClick?.();
                        }}
                      >
                        <h3 className="flex gap-4 hover:text-blue-700">{item.label}</h3>
                      </div>
                    )}
                    {item.children?.map((child) => {
                      return (
                        <div
                          key={child.key}
                          onClick={() => {
                            child.onClick?.();
                          }}
                          className="cursor-pointer"
                        >
                          <h3 className="flex gap-4 hover:text-blue-700">
                            {child.icon}
                            {child.label}
                          </h3>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
