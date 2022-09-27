import { useState, useEffect } from 'react';
import { Container, Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

import {
  useQueryNotifications,
  clearUnReadNotification,
  clearNotificationRedDot,
  readNotification,
} from '@answer/services/notification.api';

import Inbox from './components/Inbox';
import Achievements from './components/Achievements';

import { PageTitle } from '@/components';

const PAGE_SIZE = 10;

const Notifications = () => {
  const [page, setPage] = useState(1);
  const [notificationData, setNotificationData] = useState<any>([]);
  const { t } = useTranslation('translation', { keyPrefix: 'notifications' });
  const { type = 'inbox' } = useParams();

  const { data, mutate } = useQueryNotifications({
    type,
    page,
    page_size: PAGE_SIZE,
  });

  useEffect(() => {
    clearNotificationRedDot(type);
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (page > 1) {
      setNotificationData([...notificationData, ...(data?.list || [])]);
    } else {
      setNotificationData(data?.list);
    }
  }, [data]);
  const navigate = useNavigate();

  const handleTypeChange = (val) => {
    navigate(`/users/notifications/${val}`);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const handleUnreadNotification = async () => {
    await clearUnReadNotification(type);
    mutate();
  };

  const handleReadNotification = (id) => {
    readNotification(id);
  };

  return (
    <>
      <PageTitle title={t('notifications', { keyPrefix: 'page_title' })} />
      <Container className="pt-4 mt-2 mb-5">
        <Row className="justify-content-center">
          <Col xs={12} lg={7}>
            <h3 className="mb-4">{t('title')}</h3>
            <div className="d-flex justify-content-between mb-3">
              <ButtonGroup size="sm">
                <Button
                  variant="outline-secondary"
                  active={type === 'inbox'}
                  onClick={() => handleTypeChange('inbox')}>
                  {t('inbox')}
                </Button>
                <Button
                  variant="outline-secondary"
                  active={type === 'achievement'}
                  onClick={() => handleTypeChange('achievement')}>
                  {t('achievement')}
                </Button>
              </ButtonGroup>
              <Button
                variant="outline-secondary"
                onClick={handleUnreadNotification}>
                {t('all_read')}
              </Button>
            </div>
            {type === 'inbox' && (
              <Inbox
                data={notificationData}
                handleReadNotification={handleReadNotification}
              />
            )}
            {type === 'achievement' && (
              <Achievements
                data={notificationData}
                handleReadNotification={handleReadNotification}
              />
            )}
            {(data?.count || 0) > PAGE_SIZE * page && (
              <div className="d-flex justify-content-center align-items-center py-3">
                <Button
                  variant="link"
                  className="btn-no-border"
                  onClick={handleLoadMore}>
                  {t('show_more')}
                </Button>
              </div>
            )}
          </Col>
          <Col xs={12} lg={3} />
        </Row>
      </Container>
    </>
  );
};

export default Notifications;