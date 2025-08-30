import type { AxiosError } from 'axios';
import { useMemo, useState } from 'react';
import type { JSX, FormEvent } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

import api from '../utils/api';

const RestPasswordPage = (): JSX.Element => {
  return (
    <div>
      <h1>Reset Password page</h1>
    </div>
  );
};

export default RestPasswordPage;
