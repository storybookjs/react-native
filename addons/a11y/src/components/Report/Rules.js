import React from 'react';

const impactColors = {
  minor: '#f1c40f',
  moderate: '#e67e22',
  serious: '#e74c3c',
  critical: '#c0392b',
  success: '#2ecc71',
};

const styles = {
  rules: {
    display: 'flex',
    flexDirection: 'column',
    padding: '4px',
    fontWeight: '400',
  },
  rule: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '6px',
  },
  status: {
    height: '16px',
    width: '16px',
    borderRadius: '8px',
    fontSize: '10px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    textAlign: 'center',
    flex: '0 0 16px',
  },
  message: {
    paddingLeft: '6px',
  }
}

function Rule({ rule, passes }) {
  const color = ( passes ?
    impactColors.success :
    impactColors[rule.impact]
  )

  return (
    <div style={styles.rule}>
      <div
        style={{
          ...styles.status,
          backgroundColor: color,
        }}
      >
        { passes ? '✔' : '✘' }
      </div>
      <span style={styles.message}>
        {rule.message}
      </span>
    </div>
  )
}

function Rules({ rules, passes }) {
  return (
    <div style={styles.rules}>
      {rules.map((rule, index) => (
        <Rule
          passes={passes}
          rule={rule}
          key={index}
        />
      ))}
    </div>
  )
}

export default Rules;
