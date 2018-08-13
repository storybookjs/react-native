export const mockdata = {
  input: [
    {
      id: 1,
      name: 'Parent A',
      isExpanded: true,
      children: [
        {
          id: 11,
          name: 'Child A1',
          isSelected: true,
        },
        {
          id: 12,
          name: 'Child A2',
          isExpanded: false,
          children: [
            {
              id: 121,
              name: 'GrandChild A1.1',
            },
            {
              id: 122,
              name: 'GrandChild A1.2',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Parent B',
      isExpanded: true,
      isSelected: true,
      children: [
        {
          id: 21,
          name: 'Child B1',
        },
        {
          id: 22,
          name: 'Child B2',
        },
      ],
    },
  ],
  dataset: {
    '1': {
      id: 1,
      name: 'Parent A',
      isExpanded: true,
      children: ['1-11', '1-12'],
      path: '1',
      pid: '',
    },
    '2': {
      id: 2,
      name: 'Parent B',
      isExpanded: true,
      isSelected: true,
      children: ['2-21', '2-22'],
      path: '2',
      pid: '',
    },
    root: ['1', '2'],
    '1-11': {
      id: 11,
      name: 'Child A1',
      isSelected: true,
      path: '1-11',
      pid: '1',
    },
    '1-12-121': {
      id: 121,
      name: 'GrandChild A1.1',
      path: '1-12-121',
      pid: '1-12',
    },
    '1-12-122': {
      id: 122,
      name: 'GrandChild A1.2',
      path: '1-12-122',
      pid: '1-12',
    },
    '1-12': {
      id: 12,
      name: 'Child A2',
      isExpanded: false,
      children: ['1-12-121', '1-12-122'],
      path: '1-12',
      pid: '1',
    },
    '2-21': {
      id: 21,
      name: 'Child B1',
      path: '2-21',
      pid: '2',
    },
    '2-22': {
      id: 22,
      name: 'Child B2',
      path: '2-22',
      pid: '2',
    },
  },
  nested: [
    {
      id: 1,
      name: 'Parent A',
      isExpanded: true,
      children: [
        {
          id: 11,
          name: 'Child A1',
          isSelected: true,
          path: '1-11',
          pid: '1',
          depth: 1,
        },
        {
          id: 12,
          name: 'Child A2',
          isExpanded: false,
          children: [
            {
              id: 121,
              name: 'GrandChild A1.1',
              path: '1-12-121',
              pid: '1-12',
              depth: 2,
            },
            {
              id: 122,
              name: 'GrandChild A1.2',
              path: '1-12-122',
              pid: '1-12',
              depth: 2,
            },
          ],
          path: '1-12',
          pid: '1',
          depth: 1,
        },
      ],
      path: '1',
      pid: '',
      depth: 0,
    },
    {
      id: 2,
      name: 'Parent B',
      isExpanded: true,
      isSelected: true,
      children: [
        {
          id: 21,
          name: 'Child B1',
          path: '2-21',
          pid: '2',
          depth: 1,
        },
        {
          id: 22,
          name: 'Child B2',
          path: '2-22',
          pid: '2',
          depth: 1,
        },
      ],
      path: '2',
      pid: '',
      depth: 0,
    },
  ],
};
