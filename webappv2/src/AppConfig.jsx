// const wsBaseHref = process.env.WS_HOST_BASE;
const wsBaseHref = 'http://localhost:9000';
export const CAShref = `${wsBaseHref}/login`;
export const CAShrefLogout = `${wsBaseHref}/logout`;

// console.warn(process.env.PUBLIC_URL);
export const basepath = process.env.PUBLIC_URL
  ? `${process.env.PUBLIC_URL}/`
  : '/'; 

/* const ajaxConf = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
    // body: JSON.stringify(updatedPerson),
};

const ajaxUploadConf = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    // 'Content-Type': 'multipart/form-data'
  },
  credentials: 'include',
    // body: JSON.stringify(updatedPerson),
}; */

const loginConf = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  // body: JSON.stringify(updatedPerson),
};

export const api = {
  me: () => ({
    href: `${wsBaseHref}/userInfo`,
  }),
  meLogin: (uc) => ({
     href: `${wsBaseHref}/login`,
  }),
  notice: () => ({
    href: `${wsBaseHref}/notice/current`,
  }),
  card: () => {
    const cardHref = `${wsBaseHref}/card`;
    return {
      search: (name,setCode) => ({
        href: `${cardHref}?name=${name}&setCode=${setCode}`,
      }),
      collected: (id) => ({
        href: `${cardHref}/bo/${id}/collected`,
      }),
      sets: () => ({
        href: `${wsBaseHref}/sets`,
      }),
      setPhase: (id) => ({
        href: `${cardHref}/bo/${id}/phase`,
      }),
      ownChildrens: (id) => ({
        href: `${cardHref}/bo/${id}/ownerChildren`,
      }),
      create: () => ({
        href: `${cardHref}/bo`,
      }),
      upload: (id, address) => ({
        href: `${cardHref}/bo/${id}/file/${address}`,
      }),
      deleteUpload: (id, address, fid) => ({
        href: `${cardHref}/bo/${id}/file/${address}/${fid}`,
      }),
      createElement: (id, address) => ({
        href: `${cardHref}/bo/${id}/component/${address}`,
      }),
      deleteElement: (id, address) => ({
        href: `${cardHref}/bo/${id}/component/${address}`,
      })
    }
  },
  requests: () => {
    const reqsHref = `${wsBaseHref}/request/bo`;
    return {
      list: () => ({
        href: reqsHref,
      })
    };
  },
  rankings: () => {
    const rankHref = `${wsBaseHref}/request/bo/ranking`;
    return {
      list: () => ({
        href: rankHref,
      })
    };
  }
};

// GOOGLE ANALYTICS
// TODO: creare istanza per chiedove web
export const analytics = {
  enabled: true,
  trackingId: 'UA-98136694-1',
  trackUsers: true,
};